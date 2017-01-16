<div id="all">
        <div id="content">
            <div class="container">

                <div class="col-md-6">
                    <div class="box">
                        <h1>New account</h1>

                        <p class="lead">Not our registered customer yet?</p>
                        <p>With registration with us new world of fashion, fantastic discounts and much more opens to you! The whole process will not take you more than a minute!</p>
                        <p class="text-muted">If you have any questions, please feel free to <a href="contact.html">contact us</a>, our customer service center is working for you 24/7.</p>

                        <hr>
                <?php if (null !== $this->session->userdata('alert_title') && null !== $this->session->userdata('alert_message')) { ?>
                        <div class="alert alert-dismissible alert-info">
                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                            <p><strong><?=$this->session->userdata('alert_title')?></strong></p>
                            <p><?=$this->session->userdata('alert_message')?></p>
                            <?php $this->session->unset_userdata(['alert_title', 'alert_message']) ?>
                        </div>
                <?php } ?>
                        <?=form_open(site_url('register'));?>
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" class="form-control" name="full_name" id="full_name" value="<?php echo set_value('full_name') ?>" placeholder="Full Name">
                                <span class="help-block" style="color: red; font-style: italic;"><?php echo form_error('full_name')?></span>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" name="email" id="email" value="<?php echo set_value('email') ?>" placeholder="Email">
                                <span class="help-block" style="color: red; font-style: italic;"><?php echo form_error('email')?></span>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                                <span class="help-block" style="color: red; font-style: italic;"><?php echo form_error('password')?></span>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary"><i class="fa fa-user-md"></i> Register</button>
                            </div>
                        <?=form_close()?>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="box">
                        <h1>Login</h1>

                        <p class="lead">Already our customer?</p>
                        <p class="text-muted">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies
                            mi vitae est. Mauris placerat eleifend leo.</p>

                        <hr>

                        <?=form_open(site_url('login'));?>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email_l" name="email_l" placeholder="Email">
                                <span class="help-block" style="color: red; font-style: italic;"><?php echo form_error('email_l')?></span>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" class="form-control" id="password_l" name="password_l" placeholder="Password">
                                <span class="help-block" style="color: red; font-style: italic;"><?php echo form_error('password_l')?></span>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary"><i class="fa fa-sign-in"></i> Log in</button>
                            </div>
                        <?=form_close()?>
                    </div>
                </div>

            </div>
            <!-- /.container -->
        </div>
        <!-- /#content -->